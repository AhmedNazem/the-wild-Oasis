import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { useRecentBookings } from "./useRecentBookings";
import { useRecentStays } from "./useRecentStays";
import Stats from "./Stats";
import { useCabins } from "../cabins/useCabins";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";

import TodaysActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;
function DashboardLayout() {
  const { bookings, isLoading } = useRecentBookings();
  const {
    confirmedStays,
    isLoading: isLoadingStays,
    numDays,
  } = useRecentStays();

  const { cabins, isLoading: isLoading2 } = useCabins();
  if (isLoading || isLoadingStays || isLoading2) return <Spinner />;
  console.log("bookings 📙🧾", bookings);
  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numDays={numDays}
        cabinCount={cabins.length}
      />
      <TodaysActivity />
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart bookings={bookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
