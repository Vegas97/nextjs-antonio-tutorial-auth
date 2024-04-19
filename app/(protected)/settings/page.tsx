"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { settings } from "@/actions/settings";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      settings({
        name: "new Name",
      })
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">⚙️ Settings</p>
      </CardHeader>
      <CardContent>
        <Button disabled={isPending} onClick={onClick}>
          Update name
        </Button>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
