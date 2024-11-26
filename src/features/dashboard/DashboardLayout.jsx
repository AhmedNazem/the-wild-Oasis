import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { useRecentBookings } from "./useRecentBookings";
import { useRecentStays } from "./useRecentStays";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;
function DashboardLayout() {
  const { bookings, isLoading } = useRecentBookings();
  const { stays, confirmedStays, isLoading: isLoadingStays } = useRecentStays();
  if (isLoading || isLoadingStays) return <Spinner />;
  console.log(bookings);
  return (
    <StyledDashboardLayout>
      <div>Statistics </div>
      <div>Today`s activity </div>
      <div>Chart stay duration </div>
      <div>Chart of sales </div>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
