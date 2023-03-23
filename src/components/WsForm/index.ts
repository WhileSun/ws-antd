import InternalForm from "./Form";
import useForm from "./hooks/useForm";

type InternalFormType = typeof InternalForm;
type CompoundedComponent = InternalFormType & {
    useForm: typeof useForm
};

const WsForm = InternalForm as CompoundedComponent;
WsForm.useForm = useForm;
export default WsForm;