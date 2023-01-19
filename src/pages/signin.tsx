import {
  getProviders,
  signIn,
  getSession,
  getCsrfToken,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import { GoogleIcon, LogoIcon, TwitterIcon } from "../components/Icon";

function signin({
  providers,
}: {
  providers: Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>;
}) {
  return (
    <div className="flex flex-col h-screen items-center pt-40 ">
      <LogoIcon />
      <div className="text-neutral-500 mt-3"> Welcome back !</div>
      <div className="flex flex-col justify-center items-center gap-y-5 mt-6">
        {Object.values(providers).map((provider) => {
          return (
            <div key={provider?.name}>
              <button
                onClick={() => signIn(provider.id)}
                className="flex border w-80 h-11 gap-4 items-center justify-center rounded-lg hover:bg-neutral-50 bg-white shadow-sm"
                role="button"
              >
                {provider.id === "twitter" ? <TwitterIcon /> : <GoogleIcon />}
                Sign in with {provider.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default signin;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;

  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken(context),
    },
  };
}
