import type {
  CloudbedsReservation,
  CloudbedsResponse,
  CloudbedsRoom,
} from "./types";

const BASE_URL = "https://api.cloudbeds.com/api/v1.2";
const RATE_LIMIT_DELAY_MS = 350;
const PAGE_SIZE = 100;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function cloudbedsRequest<T>(
  apiKey: string,
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
): Promise<CloudbedsResponse<T>> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  await sleep(RATE_LIMIT_DELAY_MS);

  if (!res.ok) {
    throw new Error(
      `Cloudbeds ${endpoint} failed: ${res.status} ${res.statusText}`,
    );
  }

  return (await res.json()) as CloudbedsResponse<T>;
}

export async function getReservations(
  apiKey: string,
  dateFrom: string,
  dateTo: string,
): Promise<CloudbedsReservation[]> {
  const all: CloudbedsReservation[] = [];
  let page = 1;
  while (true) {
    const res = await cloudbedsRequest<CloudbedsReservation[]>(
      apiKey,
      "/getReservations",
      {
        checkInFrom: dateFrom,
        checkInTo: dateTo,
        pageNumber: page,
        pageSize: PAGE_SIZE,
      },
    );
    const data = res.data ?? [];
    all.push(...data);
    if (data.length < PAGE_SIZE) break;
    page += 1;
    if (page > 100) break;
  }
  return all;
}

export async function getRooms(apiKey: string): Promise<CloudbedsRoom[]> {
  const res = await cloudbedsRequest<CloudbedsRoom[]>(apiKey, "/getRooms");
  return res.data ?? [];
}
