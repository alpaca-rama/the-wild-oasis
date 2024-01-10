import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import {useBooking} from "../bookings/useBooking.js";
import Spinner from "../../ui/Spinner.jsx";
import {useEffect, useState} from "react";
import Checkbox from "../../ui/Checkbox.jsx";
import {formatCurrency} from "../../utils/helpers.js";
import {useCheckin} from "./useCheckin.js";
import {useSettings} from "../settings/useSettings.js";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
    const [confirmPaid, setConfirmPaid] = useState(false)
    const [addBreakfast, setAddBreakfast] = useState(false)
    const {booking, isLoading} = useBooking()
    const { checkin, isCheckingIn } = useCheckin()
    const { settings, isLoading: isLoadingSetting } = useSettings()
    const moveBack = useMoveBack();

    useEffect(() => setConfirmPaid(booking?.is_paid ?? false), [booking])

    if (isLoading || isLoadingSetting) return <Spinner />

    const {
        id: bookingId,
        guests,
        total_price,
        num_guests,
        has_breakfast,
        num_nights,
    } = booking;

    const optionalBreakfastPrice = settings.breakfast_price * num_nights * num_guests

    function handleCheckin() {
        if (!confirmPaid) return

        if (addBreakfast) {
            checkin({
                bookingId,
                breakfast: {
                    has_breakfast: true,
                    extras_price: optionalBreakfastPrice,
                    total_price: total_price + optionalBreakfastPrice
                }
            })
        } else {
            checkin({bookingId, breakfast: {} })
        }
    }

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Check in booking #{bookingId}</Heading>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            {!has_breakfast &&
                <Box>
                    <Checkbox
                        checked={addBreakfast}
                        onChange={() => {
                            setAddBreakfast((add) => !add)
                            setConfirmPaid(false)
                        }}
                        id={'breakfast'}
                    >
                        Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
                    </Checkbox>
                </Box>
            }

            <Box>
                <Checkbox
                    checked={confirmPaid}
                    onChange={() => setConfirmPaid(confirmPaid => !confirmPaid)}
                    id={'confirm'}
                    disabled={confirmPaid || isCheckingIn}
                >
                    I confirm that {guests.full_name} has paid the total amount of {!addBreakfast ? formatCurrency(total_price) : `${formatCurrency(total_price + optionalBreakfastPrice)} (${formatCurrency(total_price)} + ${formatCurrency(optionalBreakfastPrice)})`}
                </Checkbox>
            </Box>

            <ButtonGroup>
                <Button $variation="secondary" onClick={moveBack}>
                    Back
                </Button>
                <Button
                    onClick={handleCheckin}
                    disabled={!confirmPaid || isCheckingIn}
                >
                    Check in booking #{bookingId}
                </Button>
            </ButtonGroup>
        </>
    );
}

export default CheckinBooking;
