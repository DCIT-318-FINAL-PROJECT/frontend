export function generateStaticParams() {
  return [
    { slug: [] },
    ...[
      "login",
      "create-account",
      "home",
      "search",
      "report",
      "review",
      "success",
      "details",
      "contact",
      "reports",
      "notifications",
      "profile",
      "settings",
    ].map((s) => ({ slug: [s] })),
  ];
}
export default function Page() {
  return null;
}
