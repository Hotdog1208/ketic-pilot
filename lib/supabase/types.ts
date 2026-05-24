export type Property = {
  id: string;
  slug: string;
  name: string;
  location: string;
  room_count: number;
  pms_type: string;
  api_key: string | null;
  last_synced_at: string | null;
  created_at: string;
};

export type RoomEvent = {
  id: string;
  property_id: string;
  room_number: string;
  room_type: string | null;
  floor: number | null;
  checkout_time: string;
  next_checkin_time: string | null;
  vacancy_hours: number;
  kwh_wasted: number;
  cost_wasted: number;
  ketic_would_save: number;
  event_date: string;
  created_at: string;
};
