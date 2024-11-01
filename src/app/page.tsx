import Image from "next/image";
import HeroBanner from "@/presentation/components/Home/HeroBanner";
import Wrapper from "@/presentation/components/Wrapper";
import Designers from "@/presentation/components/Home/ExploreDesigner/Designers";
import CategorySection from "@/presentation/components/Home/CategorySection/CategorySection";
import ExploreSection from "@/presentation/components/Home/ExploreProducts/ExploreProducts";
import BestSellingSection from "@/presentation/components/Home/BestSeller/BestSellingSection";
import ExploreDesigns from "@/presentation/components/Home/ExploreDesigns/ExploreDesigns";
import FeatureStrip from "@/presentation/components/Home/FeatureStrip/FeatureStrip";
import About from "@/presentation/components/Home/About/About";
import PersonalizedPicks from "@/presentation/components/Home/PersonalizedPicks/PersonalizedPicks";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:gap-10 gap-5">
      <div className="text-start bg-red-400">
        <HeroBanner />
      </div>
      <Wrapper>
        <div>
          <BestSellingSection />
        </div>
      </Wrapper>
      <div className=" w-screen ">
        <FeatureStrip />
      </div>
      <Wrapper>
        <div>
          <Designers />
        </div>
        <div className="">
          <About />
        </div>
      </Wrapper>
      <div className=" w-screen ">
        <CategorySection />
      </div>
      <Wrapper>
        <div>
          <ExploreSection />
        </div>
      </Wrapper>

      <div className="bg-accent w-screen lg:px-32 mb-10">
        <ExploreDesigns />
      </div>
      <Wrapper>
        <div>
          <PersonalizedPicks />
        </div>
      </Wrapper>
    </main>
  );
}
