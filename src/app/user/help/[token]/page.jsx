
//importPropios
import RecoveryPass from "@/components/user/RecoveryPass";

export default function recoveryPassGeneral({ params }) {
  const { token } = params;
  // console.log('esto es token', token);
  
  return (
    <div>
      <RecoveryPass tokenIn={token} />
    </div>
  );
}
