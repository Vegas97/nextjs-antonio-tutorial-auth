import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <p className="font-semibold text-green-500">Hello Auth!</p>
      <Button size="lg" variant="secondary">
        Click me
      </Button>
      <Button size="lg" variant="custom">
        Click me
      </Button>
    </div>
  );
}
