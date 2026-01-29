import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Booking API Module
 * ============================================
 * All booking-related API calls consolidated
 */

type DateRange = { from?: Date; to?: Date };

export type BookingNoteVisibility =
  | "internal_ops"
  | "partner_visible"
  | "customer_visible";

export type BookingNote = {
  id: string;
  bookingId: string;
  message: string;
  visibility: BookingNoteVisibility;
  senderRole?: string;
  receiverIds?: string[];
  createdAt?: string;
};

type BookingNotesResponse = {
  bookingId?: string;
  notes?: BookingNote[];
};

// ============================================
// GET OPERATIONS
// ============================================

/**
 * Fetch all bookings with optional filters
 */
export const getAllBookings = async (
  DateRange: DateRange,
  page?: number,
  limit?: number,
  status?: string,
) => {
  const params: Record<string, unknown> = {};

  if (DateRange?.from || DateRange?.to) {
    params.DateRange = {
      startDate: DateRange.from
        ? new Date(DateRange.from).toISOString()
        : undefined,
      endDate: DateRange.to
        ? new Date(
            Date.UTC(
              DateRange.to.getUTCFullYear(),
              DateRange.to.getUTCMonth(),
              DateRange.to.getUTCDate(),
              23,
              59,
              59,
              999,
            ),
          ).toISOString()
        : undefined,
    };
  }

  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (status) params.status = status;

  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_BOOKINGS, {
      params,
    });
    return response?.data?.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return { bookings: [], pagination: {} };
    }
    if (isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

/**
 * Hook to fetch all bookings
 */
export const useFetchAllBookings = ({
  DateRange,
  page,
  limit,
  status,
  queryOptions,
}: {
  DateRange: DateRange;
  page?: number;
  limit?: number;
  status?: string;
  queryOptions?: Record<string, any>;
}) =>
  useQuery({
    queryKey: ["bookings", DateRange, page, limit, status],
    queryFn: () => getAllBookings(DateRange, page, limit, status),
    refetchOnWindowFocus: false,
    retry: false,
    // staleTime: 0,
    ...queryOptions,
  });

/**
 * Fetch booking by ID
 */
export const getBookingById = async (id?: string) => {
  if (id) {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_BOOKING_BY_ID.replace(":id", id)}`,
    );
    return response?.data?.data;
  }
  return null;
};

/**
 * Hook to fetch booking by ID
 */
export const useFetchBookingById = ({ id }: { id?: string }) =>
  useQuery({
    queryKey: ["bookingById", id],
    queryFn: () => getBookingById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch booking notes by booking ID
 */
export const getBookingNotes = async (
  bookingId?: string,
): Promise<BookingNotesResponse> => {
  if (!bookingId) return { bookingId, notes: [] };
  const response = await axiosInstance.get(
    API_ENDPOINTS.BOOKING_NOTES.replace(":bookingId", bookingId),
  );
  return response?.data?.data ?? response?.data;
};

/**
 * Hook to fetch booking notes
 */
export const useFetchBookingNotes = ({ bookingId }: { bookingId?: string }) =>
  useQuery<BookingNotesResponse>({
    queryKey: ["bookingNotes", bookingId],
    queryFn: () => getBookingNotes(bookingId),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: Boolean(bookingId),
  });

export type CreateBookingNotePayload = {
  bookingId: string;
  message: string;
  visibility: BookingNoteVisibility;
};

/**
 * Create booking note
 */
export const createBookingNote = async (payload: CreateBookingNotePayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.NOTES, payload);
  return response?.data?.data ?? response?.data;
};

/**
 * Hook to create booking note
 */
export const useCreateBookingNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingNotePayload) =>
      createBookingNote(payload),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({
        queryKey: ["bookingNotes", payload.bookingId],
      });
    },
  });
};
