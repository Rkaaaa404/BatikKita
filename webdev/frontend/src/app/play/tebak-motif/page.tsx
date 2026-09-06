import { redirect } from "next/navigation";

export default function TebakMotifRedirectPage() {
  redirect("/play/guess");
}
