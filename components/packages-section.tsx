"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, Clock, CheckCircle2, ArrowRight } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchApprovedPackages } from "@/lib/redux/features/packages/package-slice";
import { formatRupiah } from "@/lib/data";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 3;

export function PackagesSection() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.packages);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    dispatch(fetchApprovedPackages());
  }, [dispatch]);

  const visiblePackages = items.slice(0, visibleCount);
  const hasMorePackages = visibleCount < items.length;

  return (
    <section id="paket" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Paket Wisata
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Pilih Paket Eco-Tour Anda
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Setiap paket dirancang dengan prinsip wisata berkelanjutan,
            menyertakan donasi konservasi dan panduan lokal berpengalaman.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 text-center text-muted-foreground">
            Memuat paket wisata...
          </div>
        ) : error ? (
          <div className="mt-16 text-center text-red-500">
            Gagal memuat paket wisata.
          </div>
        ) : visiblePackages.length === 0 ? (
          <div className="mt-16 text-center text-muted-foreground">
            Belum ada paket wisata tersedia.
          </div>
        ) : (
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visiblePackages.map((pkg) => (
              <Card
                key={pkg.id}
                className="group flex flex-col transition-all hover:shadow-xl hover:border-primary/40"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {pkg.duration}
                    </div>

                    {pkg.eco && (
                      <Badge
                        variant="secondary"
                        className="gap-1 border-primary/20 bg-primary/10 text-primary"
                      >
                        <Leaf className="h-3 w-3" />
                        Eco
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-xl text-foreground transition-colors group-hover:text-primary">
                    {pkg.title}
                  </CardTitle>

                  <CardDescription className="text-2xl font-bold text-foreground">
                    {formatRupiah(pkg.price)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / orang
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <Separator className="mb-4" />
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Termasuk
                  </p>

                  <ul className="flex flex-col gap-2">
                    {pkg.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/paket/${pkg.id}`}>
                      Lihat Detail
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        {hasMorePackages && (
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
