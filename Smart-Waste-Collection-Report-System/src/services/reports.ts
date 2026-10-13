import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  type QuerySnapshot,
  setDoc,
  where,
  writeBatch,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "./firebase";
import { mapEvent, mapReport } from "./mappers";
import { uploadPhotos } from "./storage";
import type { ErrorListener, Listener } from "./users";
import {
  STATUS_LABELS,
  type GeoPoint,
  type Priority,
  type Report,
  type ReportCategory,
  type ReportEvent,
  type ReportStatus,
} from "../lib/types";

const reportsCol = () => collection(db, "reports");

function mapReports(snap: QuerySnapshot): Report[] {
  return snap.docs.map((d) => mapReport(d.id, d.data()));
}

/** Reports created by a citizen. */
export function subscribeMyReports(uid: string, next: Listener<Report[]>, onError: ErrorListener) {
  return onSnapshot(
    query(reportsCol(), where("reporterId", "==", uid)),
    (snap) => next(mapReports(snap)),
    (err: FirestoreError) => onError(err),
  );
}

/** Reports currently assigned to a worker. */
export function subscribeAssignedReports(uid: string, next: Listener<Report[]>, onError: ErrorListener) {
  return onSnapshot(
    query(reportsCol(), where("assignedWorkerId", "==", uid)),
    (snap) => next(mapReports(snap)),
    (err: FirestoreError) => onError(err),
  );
}

/** Every report (admins only). */
export function subscribeAllReports(next: Listener<Report[]>, onError: ErrorListener) {
  return onSnapshot(
    reportsCol(),
    (snap) => next(mapReports(snap)),
    (err: FirestoreError) => onError(err),
  );
}

export function subscribeReport(id: string, next: Listener<Report>, onError: ErrorListener) {
  return onSnapshot(
    doc(db, "reports", id),
    (snap) => {
      if (snap.exists()) next(mapReport(snap.id, snap.data()));
      else onError(new Error("This report does not exist or you do not have access to it."));
    },
    (err: FirestoreError) => onError(err),
  );
}

export function subscribeReportEvents(reportId: string, next: Listener<ReportEvent[]>, onError: ErrorListener) {
  return onSnapshot(
    collection(db, "reports", reportId, "events"),
    (snap) =>
      next(
        snap.docs
          .map((d) => mapEvent(d.id, d.data()))
          .sort((a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0)),
      ),
    (err: FirestoreError) => onError(err),
  );
}

export type NewReportInput = {
  reporterId: string;
  reporterName: string;
  title: string;
  description: string;
  category: ReportCategory;
  address: string;
  location: GeoPoint;
  zone: { id: string; name: string } | null;
  photos: File[];
};

/** Creates a report: uploads photos first, then writes the report and its first timeline event. */
export async function createReport(input: NewReportInput): Promise<string> {
  const reportRef = doc(reportsCol());
  const photoUrls = await uploadPhotos(`reports/${reportRef.id}`, input.photos);

  await setDoc(reportRef, {
    title: input.title,
    description: input.description,
    category: input.category,
    status: "pending",
    priority: "medium",
    reporterId: input.reporterId,
    reporterName: input.reporterName,
    address: input.address,
    location: { lat: input.location.lat, lng: input.location.lng },
    zoneId: input.zone?.id ?? null,
    zoneName: input.zone?.name ?? null,
    photoUrls,
    completionPhotoUrls: [],
    assignedWorkerId: null,
    assignedWorkerName: null,
    notes: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    resolvedAt: null,
  });

  await addDoc(collection(reportRef, "events"), {
    status: "pending",
    message: "Report submitted",
    actorId: input.reporterId,
    actorName: input.reporterName,
    createdAt: serverTimestamp(),
  });

  return reportRef.id;
}

export type ReportChanges = Partial<{
  status: ReportStatus;
  priority: Priority;
  assignedWorkerId: string | null;
  assignedWorkerName: string | null;
  notes: string;
  completionPhotoUrls: string[];
}>;

export type NotificationInput = { userId: string; title: string; message: string };

/**
 * Applies changes to a report, appends a timeline event and sends notifications,
 * all in one atomic batch so the timeline never disagrees with the report.
 */
export async function applyReportUpdate(params: {
  report: Pick<Report, "id" | "status">;
  actor: { id: string; name: string };
  changes: ReportChanges;
  message: string;
  notifications?: NotificationInput[];
}): Promise<void> {
  const { report, actor, changes, message, notifications = [] } = params;
  const batch = writeBatch(db);
  const reportRef = doc(db, "reports", report.id);
  const finalStatus = changes.status ?? report.status;

  batch.update(reportRef, {
    ...changes,
    updatedAt: serverTimestamp(),
    ...(changes.status === "resolved" ? { resolvedAt: serverTimestamp() } : {}),
  });

  batch.set(doc(collection(reportRef, "events")), {
    status: finalStatus,
    message,
    actorId: actor.id,
    actorName: actor.name,
    createdAt: serverTimestamp(),
  });

  for (const n of notifications) {
    batch.set(doc(collection(db, "notifications")), {
      userId: n.userId,
      title: n.title,
      message: n.message,
      reportId: report.id,
      read: false,
      createdAt: serverTimestamp(),
    });
  }

  await batch.commit();
}

export function statusNotification(reportTitle: string, status: ReportStatus) {
  return {
    title: `Report ${STATUS_LABELS[status].toLowerCase()}`,
    message: `Your report "${reportTitle}" is now ${STATUS_LABELS[status].toLowerCase()}.`,
  };
}
