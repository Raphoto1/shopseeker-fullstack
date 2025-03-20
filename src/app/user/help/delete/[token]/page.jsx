//imports propios
import DeleteAccountConfirm from "@/components/user/DeleteAccountConfirm";

export default function deleteLink({ params }) {
  const { token } = params;
  return (
    <div>
      <DeleteAccountConfirm tokenIn={token} />
    </div>
  );
}
