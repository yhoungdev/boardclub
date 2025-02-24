import dynamic from "next/dynamic";

const SquadPage = dynamic(() => import("@/components/pages/squad/squad"), {
  ssr: false,
});

const Squad = () => {
  return <SquadPage />;
};

export default Squad;
