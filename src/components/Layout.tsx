import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Dropdown } from "./Dropdown";
import { LogoIcon } from "./Icon";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();

  return (
    <div className="px-14">
      {/*<div className="flex items-center justify-between h-14 ">*/}
      {/*  <LogoIcon />*/}

      {/*  {session ? (*/}
      {/*    <div className="flex gap-4 items-center">*/}
      {/*      <div>{session?.user?.name}</div>*/}
      {/*      <Dropdown*/}
      {/*        classname="-right-14 sm:right-0 w-84 sm:w-112 border"*/}
      {/*        trigger={*/}
      {/*          <Image*/}
      {/*            className="rounded-full shadow"*/}
      {/*            width={40}*/}
      {/*            height={40}*/}
      {/*            blurDataURL={session?.user?.image as string}*/}
      {/*            src={session?.user?.image as string}*/}
      {/*            quality={100}*/}
      {/*            alt="avatar"*/}
      {/*          />*/}
      {/*        }*/}
      {/*      >*/}
      {/*        <button className="w-44 h-9" onClick={() => signOut()}>*/}
      {/*          Sign out*/}
      {/*        </button>*/}
      {/*      </Dropdown>*/}
      {/*    </div>*/}
      {/*  ) : (*/}
      {/*    <>*/}
      {/*      <button onClick={() => signIn()}>Sign in</button>*/}
      {/*    </>*/}
      {/*  )}*/}
      {/*</div>*/}
      <main>{children}</main>
    </div>
  );
}
