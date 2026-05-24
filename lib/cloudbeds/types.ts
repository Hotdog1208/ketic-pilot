export type CloudbedsReservation = {
  reservationID: string;
  roomID: string;
  roomName?: string;
  roomTypeID?: string;
  roomTypeName?: string;
  guestName?: string;
  startDate: string;
  endDate: string;
  checkInDate?: string;
  checkOutDate?: string;
  status: string;
  total?: number | string;
};

export type CloudbedsRoom = {
  roomID: string;
  roomName: string;
  roomTypeID: string;
  roomTypeName: string;
  floor?: number | string;
};

export type CloudbedsResponse<T> = {
  success: boolean;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  pageSize?: number;
  message?: string;
};
