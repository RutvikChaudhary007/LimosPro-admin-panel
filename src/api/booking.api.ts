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

export type BookingHistoryEntry = {
  status?: string;
  timestamp?: string;
  note?: string;
  state?: "active" | "pending" | "completed";
};

type BookingHistoryResponse = {
  bookingId?: string;
  currentStatus?: string;
  history?: BookingHistoryEntry[];
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
    staleTime: 0,
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
 * Fetch booking history (lifecycle)
 */
export const getBookingHistory = async (
  bookingId?: string,
): Promise<BookingHistoryResponse> => {
  if (!bookingId) return { bookingId, history: [] };
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.BOOKING_HISTORY.replace(":bookingId", bookingId),
    );
    const responseData = response?.data?.data ?? response?.data;
    const lifecycle = Array.isArray(responseData?.lifecycle)
      ? responseData.lifecycle
      : [];
    const lifecycleHistory: BookingHistoryEntry[] = lifecycle.map(
      (item: any) => ({
        status: item?.label || item?.key,
        timestamp: item?.timestamp ?? undefined,
        note: item?.description ?? undefined,
        state: item?.state,
      }),
    );
    return {
      bookingId,
      currentStatus: responseData?.currentStatus,
      history: lifecycleHistory.length
        ? lifecycleHistory
        : Array.isArray(responseData?.history)
          ? responseData.history
          : Array.isArray(responseData)
            ? responseData
            : [],
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return { bookingId, history: [] };
    }
    throw new Error("Failed to fetch booking history");
  }
};

/**
 * Hook to fetch booking history
 */
export const useFetchBookingHistory = ({ bookingId }: { bookingId?: string }) =>
  useQuery<BookingHistoryResponse>({
    queryKey: ["bookingHistory", bookingId],
    queryFn: () => getBookingHistory(bookingId),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: Boolean(bookingId),
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

export const assignChauffeurs = async (id: string) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.PARTNER_ASSIGN_CHAUFFEUR(id),
  );
  return response?.data?.data ?? response?.data;
};

/**
 * assignchauffeur
 */
export const useAssignChauffeurs = () => {
  return useMutation({
    mutationFn: (id: string) => assignChauffeurs(id),
    onSuccess: (_data) => {
      // toast.success("Chauffeur assigned successfully",_data);
    },
  });
};

/**
 * Update booking status
 */
export const updateBookingStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.UPDATE_BOOKING_STATUS(id, status),
  );
  return response?.data?.data ?? response?.data;
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["bookingById", id] });
      queryClient.invalidateQueries({ queryKey: ["bookingHistory", id] });
    },
  });
};

/**
 * Retry partner dispatch
 */
export const retryPartnerDispatch = async (id: string) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.RETRY_PARTNER_DISPATCH(id),
  );
  return response?.data?.data ?? response?.data;
};

export const useRetryPartnerDispatch = () => {
  return useMutation({
    mutationFn: retryPartnerDispatch,
  });
};
