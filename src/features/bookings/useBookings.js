import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

export function useBookings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };
  //*👆🏼 filter 👇🏼sort

  const sortByRow = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRow.split("-");
  const sortBy = { field, direction };
  //* pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  //*
  const {
    isLoading,
    data, // Correct: Access data directly
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page], //? it used when we have a db getting the data from the apis
    queryFn: () => getBookings({ filter, sortBy, page }),
  });
  const bookings = data?.data || [];
  const count = data?.count || 0;

  return { isLoading, error, bookings, count };
}
