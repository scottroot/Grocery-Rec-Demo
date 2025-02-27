import SwitchButton from "@/app/user/switch/SwitchButton";


export default async function Page() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Switch users
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <SwitchButton title="Existing" subtitle="" targetId={1} />
          <SwitchButton title="Guest" subtitle="Temporary user" targetId={0} />
          <SwitchButton title="Random" subtitle="Switch to another user from the dataset" targetId={-1} />
        </div>
      </div>
    </div>
  )
}
