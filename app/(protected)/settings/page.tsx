"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { settings } from "@/actions/settings";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

const SettingsPage = () => {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const name = "Pippo2";

  const onClick = () => {
    startTransition(() => {
      settings({
        name,
      })
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            console.log({
              dataSuccess: data.success,
            });
            update().then((res) => {
              console.log({
                updateResult: res,
              });
            });
            setSuccess(data.success);
          }
        })
        .catch(() => setError(`Something went wrong for ${name}!`));
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">⚙️ Settings</p>
      </CardHeader>
      <CardContent>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button disabled={isPending} onClick={onClick} className="py-5">
          Update name with {name}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
