import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

// eslint-disable-next-line react/prop-types
function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  //* using the react query hook "useForm" for automate the Form data values
  //*using the query Client to see the result in the moment we
  //* click on the button without doing reload to the page
  //* using the toast to give us pop alert that shows the result of the fetching
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();
  //!

  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];
    if (isEditSession)
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: () => reset(),
        }
      );
    else
      createCabin(
        { ...data, image },
        {
          onSuccess: () => reset(),
        }
      );
    console.log(data);
  }
  function onError(errors) {
    console.error(errors);
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          placeholder="Cabin name"
          disabled={isWorking}
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required ",
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          placeholder="capacity"
          disabled={isWorking}
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required ",
            min: {
              value: 1,
              message: "Capacity should be at least one ",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          placeholder="Price"
          disabled={isWorking}
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required ",
            min: {
              value: 1,
              message: "Price should be at least 10$ ",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          disabled={isWorking}
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) => {
              const regularPrice = parseFloat(getValues("regularPrice"));
              return (
                value <= regularPrice ||
                "Discount should be less than the regular price"
              );
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          placeholder="Description"
          type="number"
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required ",
          })}
        />
      </FormRow>

      <FormRow label="Cabin Photo">
        <FileInput
          type="file"
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This field is required ",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create new Cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
