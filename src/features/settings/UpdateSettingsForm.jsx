import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import {useSettings} from "./useSettings.js";
import Spinner from "../../ui/Spinner.jsx";
import {useUpdateSetting} from "./useUpdateSetting.js";

function UpdateSettingsForm() {
    const { isLoading, settings: {
        min_booking_length,
        max_booking_length,
        max_guests_per_booking,
        breakfast_price} = {}
    } = useSettings()
    const { isUpdating, updateSetting } = useUpdateSetting()

    if (isLoading) return <Spinner />

    function handleUpdateSetting(e) {
        const { value, id, defaultValue } = e.target

        if (!value || !id || defaultValue === value) return

        updateSetting({ [id]: value })
        e.target.defaultValue = value
    }

    return (
        <Form>
            <FormRow label='Minimum nights/booking'>
                <Input
                    type='number'
                    id='min_booking_length'
                    defaultValue={min_booking_length}
                    onBlur={e => handleUpdateSetting(e)}
                    disabled={isUpdating}
                />
            </FormRow>
            <FormRow label='Maximum nights/booking'>
                <Input
                    type='number'
                    id='max_booking_length'
                    defaultValue={max_booking_length}
                    onBlur={e => handleUpdateSetting(e)}
                    disabled={isUpdating}
                />
            </FormRow>
            <FormRow label='Maximum guests/booking'>
                <Input
                    type='number'
                    id='max_guests_per_booking'
                    defaultValue={max_guests_per_booking}
                    onBlur={e => handleUpdateSetting(e)}
                    disabled={isUpdating}
                />
            </FormRow>
            <FormRow label='Breakfast price'>
                <Input
                    type='number'
                    id='breakfast_price'
                    defaultValue={breakfast_price}
                    onBlur={e => handleUpdateSetting(e)}
                    disabled={isUpdating}
                />
            </FormRow>
        </Form>
    );
}

export default UpdateSettingsForm;
