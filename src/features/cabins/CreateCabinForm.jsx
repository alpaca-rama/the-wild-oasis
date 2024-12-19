import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow.jsx";

import { useCreateCabin } from "./useCreateCabin.js";
import { useEditCabin } from "./useEditCabin.js";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
    const { id: editId, ...editValues } = cabinToEdit
    const isEditSession = Boolean(editId)

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState
    } = useForm({
        defaultValues: isEditSession ? editValues : {}
    })
    const { errors } = formState

    const { isCreating, createCabin } = useCreateCabin()
    const { isEditing, editCabin } = useEditCabin()

    const isWorking = isCreating || isEditing

    function onSubmit(data) {
        const image = typeof data.image === 'string' ? data.image : data.image[0]

        if (isEditSession) editCabin({ newCabinData: { ...data, image }, id: editId }, {
            onSuccess: () => {
                // console.log(data)
                reset()
                onCloseModal?.()
            }
        })
        else createCabin({ ...data, image: image }, {
            onSuccess: () => {
                // console.log(data)
                reset()
                onCloseModal?.()
            }
        })
    }

    function onError() {
        // console.log(errors)
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
            <FormRow label={'Cabin name'} error={errors?.name?.message}>
                <Input
                    type="text"
                    id="name"
                    disabled={isWorking}
                    {...register('name', {
                        required: 'This field is required.',
                    })}
                />
            </FormRow>

            <FormRow label={'Maximum capacity'} error={errors?.max_capacity?.message}>
                <Input
                    type="number"
                    id="max_capacity"
                    disabled={isWorking}
                    {...register('max_capacity', {
                        required: 'This field is required.',
                        min: {
                            value: 1,
                            message: 'Capacity should be at least 1.'
                        }
                    })}
                />
            </FormRow>

            <FormRow label={'Regular price'} error={errors?.regular_price?.message}>
                <Input
                    type="number"
                    id="regular_price"
                    disabled={isWorking}
                    {...register('regular_price', {
                        required: 'This field is required.',
                        min: {
                            value: 1,
                            message: 'Price should be at least 1.'
                        }
                    })}
                />
            </FormRow>

            <FormRow label={'Discount'} error={errors?.discount?.message}>
                <Input
                    type="number"
                    id="discount"
                    defaultValue={0}
                    disabled={isWorking}
                    {...register('discount', {
                        required: 'This field is required.',
                        validate: value => +value <= +getValues().regular_price || 'Discount should be less than the Regular price.'
                    })}
                />
            </FormRow>

            <FormRow label={'Description'} error={errors?.description?.message}>
                <Textarea
                    type="number"
                    id="description"
                    defaultValue=""
                    disabled={isWorking}
                    {...register('description', {
                        required: 'This field is required.',
                    })}
                />
            </FormRow>

            <FormRow label={'Cabin photo'}>
                <FileInput
                    id="image"
                    accept="image/*"
                    type={'file'}
                    {...register('image', {
                        required: isEditSession ? false : 'This field is required.',
                    })}
                />
            </FormRow>

            <FormRow>
                {/* type is an HTML attribute! */}
                <Button $variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
                    Cancel
                </Button>
                <Button disabled={isWorking}>{isEditSession ? 'Edit cabin' : 'Add new Cabin'}</Button>
            </FormRow>
        </Form>
    );
}

export default CreateCabinForm;
