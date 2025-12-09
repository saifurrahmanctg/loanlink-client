export default function DashboardFooter() {
  return (
    <footer className="sticky bottom-0 w-full bg-base-300 px-6 py-4 text-center text-sm text-gray-600">
      © {new Date().getFullYear}{" "}
      <span className="text-gradient font-bold font-rajdhani">LoanLink</span>.
      All rights reserved.
    </footer>
  );
}
