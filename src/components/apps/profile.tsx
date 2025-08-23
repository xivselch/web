import { FiExternalLink } from "solid-icons/fi";
import { IoRefresh } from "solid-icons/io";
import { TbWorld } from "solid-icons/tb";
import { createSignal, createEffect, Show } from "solid-js";
import { Badge } from "../ui/badge";
import { Progress, ProgressLabel, ProgressValueLabel } from "../ui/progress";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Label } from "../ui/label";
import { formatDistanceToNow } from "date-fns";
import { Col, Grid } from "../ui/grid";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { Character } from "~/types";

function RelativeTime(props: { date: Date }) {
  const [relativeTime, setRelativeTime] = createSignal(
    formatDistanceToNow(props.date, { addSuffix: true })
  );

  createEffect(() => {
    const interval = setInterval(
      () => setRelativeTime(formatDistanceToNow(props.date, { addSuffix: true })),
      60 * 1000
    );
    return () => clearInterval(interval);
  });

  return relativeTime();
}

export default function Profile(props: { data: Character }) {
  const { data } = props;

  return (
    <div class="grid gap-6 w-full max-w-3xl mx-auto items-center m-2">
      <Show when={data}>
        <Card class="overflow-hidden p-4">
          <Grid class="gap-4">
            <Col>
              <div class="grid gap-2">
                <img
                  class="w-full h-96 object-cover object-[center_10%] rounded-xl bg-muted"
                  src={data?.portrait!}
                />
                <div class="flex justify-between items-center bg-accent/25 rounded-xl px-4">
                  <div class="flex justify-between items-center gap-2">
                    <Button
                      variant={"ghost"}
                      class="hover:bg-transparent cursor-pointer opacity-80 hover:opacity-100"
                    >
                      <IoRefresh /> Refresh
                    </Button>
                    <Label class="text-sm">
                      Last updated:{" "}
                      <span class="opacity-50">
                        <RelativeTime date={data?.parsed_at!} />
                      </span>
                    </Label>
                  </div>
                  <div class="flex justify-between items-center">
                    <Show when={data.rankings.ffxivcollect}>
                      <Button
                        as="a"
                        href={`https://ffxivcollect.com/characters/${data.id}/`}
                        target="_blank"
                        size={"icon"}
                        variant={"link"}
                      >
                        <img
                          class="size-6"
                          src="https://ffxivcollect.com/assets/logo-14048634472d688447c06397d03ce26c11d688c240a9d6faef97dc7e07e3cd8c.png"
                        />
                      </Button>
                    </Show>
                    <Show when={data.rankings.lalachievements}>
                      <Button
                        as="a"
                        href={`https://lalachievements.com/char/${data.id}/`}
                        target="_blank"
                        size={"icon"}
                        variant={"link"}
                      >
                        <img class="size-6" src="https://lalachievements.com/favicon.ico" />
                      </Button>
                    </Show>
                    <Button
                      as="a"
                      href={`https://na.finalfantasyxiv.com/lodestone/character/${data.id}`}
                      target="_blank"
                      size={"icon"}
                      variant={"link"}
                    >
                      <img class="size-6" src="https://eu.finalfantasyxiv.com/favicon.ico" />
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
            <Col>
              <CardHeader class="flex w-full p-4">
                <div class="flex items-start gap-4">
                  <img src={data.avatar} class="size-32 rounded-lg border" />
                  <div>
                    <div class="mb-2">
                      {data?.verified ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="warning">Not verified</Badge>
                      )}
                    </div>
                    <span class="text-muted-foreground">{data.title}</span>
                    <h1 class="text-3xl font-bold">{data.name}</h1>
                    <h2 class="flex gap-1 items-center text-muted-foreground">
                      <TbWorld /> {data.world_name} ({data.dc_name})
                    </h2>
                  </div>
                </div>

                <div class="flex flex-wrap gap-6 items-center px-4 mt-4 text-md font-semibold">
                  <div class="flex flex-col items-center gap-2">
                    <h3>Achievements</h3>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge class="select-none">{data?.achievements?.score ?? "-"} pts</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {data?.achievements
                          ? `${data.achievements.total}/3123 (${Math.round(
                              (data.achievements.total / 3123) * 100
                            )}%)`
                          : "No data"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <h3>Minions</h3>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge class="select-none">{data?.minions ?? "-"}</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {data?.minions
                          ? `${data.minions}/476 (${Math.round((data.minions / 476) * 100)}%)`
                          : "No data"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <h3>Mounts</h3>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge class="select-none">{data?.mounts ?? "-"}</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {data?.mounts
                          ? `${data.mounts}/273 (${Math.round((data.mounts / 273) * 100)}%)`
                          : "No data"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <h3>Facewear</h3>
                    <Badge class="select-none">{data.facewear ?? "-"}</Badge>
                  </div>
                </div>
              </CardHeader>

              <div class="flex flex-col justify-between p-5">
                <Show when={data.rankings.ffxivcollect}>
                  <div class="flex items-center justify-between border-b pb-2">
                    <div class="flex items-center gap-2">
                      <img
                        src="https://ffxivcollect.com/assets/logo-14048634472d688447c06397d03ce26c11d688c240a9d6faef97dc7e07e3cd8c.png"
                        alt="FFXIVCollect"
                        class="size-5"
                      />
                      <Button
                        as="a"
                        href={`https://ffxivcollect.com/characters/${data.id}/`}
                        target="_blank"
                        variant="link"
                        class="p-0 text-sm font-medium"
                      >
                        FFXIVCollect <FiExternalLink />
                      </Button>
                    </div>
                    <div class="flex gap-2 text-sm">
                      <Show when={data.rankings.ffxivcollect.achievements}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary">
                              #{data.rankings.ffxivcollect.achievements.global}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Global Achievements</TooltipContent>
                        </Tooltip>
                      </Show>
                      <Show when={data.rankings.ffxivcollect.minions}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary">
                              #{data.rankings.ffxivcollect.minions.global}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Global Minions</TooltipContent>
                        </Tooltip>
                      </Show>
                      <Show when={data.rankings.ffxivcollect.mounts}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary">
                              #{data.rankings.ffxivcollect.mounts.global}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Global Mounts</TooltipContent>
                        </Tooltip>
                      </Show>
                    </div>
                  </div>
                </Show>

                {/* Lalachievements */}
                <Show when={data.rankings.lalachievements}>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <img
                        src="https://lalachievements.com/favicon.ico"
                        alt="Lalachievements"
                        class="size-5"
                      />
                      <Button
                        as="a"
                        href={`https://lalachievements.com/char/${data.id}/`}
                        target="_blank"
                        variant="link"
                        class="p-0 text-sm font-medium"
                      >
                        Lalachievements <FiExternalLink />
                      </Button>
                    </div>
                    <div class="flex gap-2 text-sm">
                      <Show when={data.rankings.lalachievements.achievements}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary">
                              #{data.rankings.lalachievements.achievements.global}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Global Achievements</TooltipContent>
                        </Tooltip>
                      </Show>
                    </div>
                  </div>
                </Show>
              </div>
            </Col>
          </Grid>
        </Card>
      </Show>
    </div>
  );
}
