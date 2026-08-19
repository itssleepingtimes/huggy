export type UserProfile = {
  uid: string;
  name: string;
  photoURL: string | null;
  coupleId: string | null;
  expoPushToken: string | null;
  createdAt: number;
};

export type Couple = {
  id: string;
  memberIds: string[];
  inviteCode: string | null; // shown to the creator until their partner joins
  anniversaryDate: string | null; // ISO date, e.g. "2024-02-14"
  createdAt: number;
  streak: {
    count: number;
    lastOpenedDates: Record<string, string>; // uid -> "YYYY-MM-DD"
    lastCompletedDate: string | null; // last date both partners had opened the app
  };
};

export type PartnerLocation = {
  uid: string;
  lat: number;
  lng: number;
  heading: number | null;
  speed: number | null;
  battery: number | null;
  updatedAt: number;
};

export type Place = {
  id: string;
  name: string;
  icon: string;
  lat: number;
  lng: number;
  radius: number; // meters
  createdBy: string;
};

export type PlaceEvent = {
  id: string;
  uid: string;
  placeId: string;
  placeName: string;
  type: "arrive" | "leave";
  timestamp: number;
};

export type Moment = {
  id: string;
  uid: string;
  text: string;
  createdAt: number;
};

export type DailyPrompt = {
  date: string; // "YYYY-MM-DD"
  promptText: string;
  answers: Record<string, string>;
};

export type Poke = {
  id: string;
  fromUid: string;
  createdAt: number;
};
