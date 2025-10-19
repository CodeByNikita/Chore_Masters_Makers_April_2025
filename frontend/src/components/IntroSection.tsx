export default function IntroSection() {
  return (
    <div className="bg-indigo-50 px-12 ml-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-4">
          Make Chores Fun and Rewarding! 🌟
        </h2>
        <p className="text-lg text-indigo-800 mb-6">
          Chore Masters helps parents create engaging tasks for their kids, with
          exciting rewards that motivate them to participate in household
          responsibilities.
        </p>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-white p-4 rounded-lg shadow">
            <span className="text-2xl">📝</span>
            <h3 className="font-semibold text-indigo-900 mt-2">Set Tasks</h3>
            <p className="text-sm text-indigo-700">
              Create and assign daily or weekly chores
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <span className="text-2xl">🎯</span>
            <h3 className="font-semibold text-indigo-900 mt-2">
              Track Progress
            </h3>
            <p className="text-sm text-indigo-700">
              Monitor completion of tasks in real-time
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <span className="text-2xl">🎁</span>
            <h3 className="font-semibold text-indigo-900 mt-2">Earn Rewards</h3>
            <p className="text-sm text-indigo-700">
              Win exciting prizes for completing chores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
