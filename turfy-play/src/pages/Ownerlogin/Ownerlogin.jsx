import OwnerloginHeader from "./components/OwnerloginHeader";
import OwnerloginForm from "./components/Ownerloginform";
import OwnerloginFooter from "./components/OwnerloginFooter";

export default function Ownerlogin() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <div className="flex flex-1 items-center justify-center p-4 py-10 sm:p-6 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <OwnerloginHeader />

          <OwnerloginForm />

          <OwnerloginFooter />
        </div>
      </div>
    </div>
  );
}