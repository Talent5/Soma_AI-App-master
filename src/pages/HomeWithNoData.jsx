import ApplicationLabels from "../components/ApplicationLabels";
import NavBar from "../components/NavBar";

export const Root = () => {
  return (
    <div className="w-full relative [background:radial-gradient(50%_50%_at_50%_50%,_#fca4b0,_#e6e0fe_54%,_#b7f1fd)] overflow-hidden flex flex-col items-start justify-start pt-3 px-0 pb-0 box-border leading-[normal] tracking-[normal]">
      <main className="self-stretch h-[724px] flex flex-col items-start justify-start gap-3 max-w-full text-left text-[12px] text-sg-sys-color-on-surface font-sg-sys-typescale-headline-medium-semibold">
        <div className="self-stretch flex flex-row items-start justify-start py-0 pl-4 pr-[17px] box-border max-w-full">
          <div className="flex-1 flex flex-row items-start justify-between max-w-full gap-5">
            <a className="[text-decoration:none] relative font-semibold text-[inherit] inline-block min-w-[49px] whitespace-nowrap">
              9:40 pm
            </a>
            <div className="w-[50.5px] flex flex-col items-start justify-start pt-0.5 px-0 pb-0 box-border">
              <img
                className="self-stretch h-[10.6px] relative max-w-full overflow-hidden shrink-0"
                loading="lazy"
                alt=""
                src="/union.svg"
              />
            </div>
          </div>
        </div>
        <section className="self-stretch flex-1 flex flex-col items-start justify-start py-3 px-4 text-left text-base text-sg-sys-color-on-surface font-sg-sys-typescale-headline-medium-semibold">
          <div className="self-stretch rounded-md bg-sg-sys-color-surface border-sg-sys-color-outline border-[0.4px] border-solid flex flex-col items-start justify-start py-[15px] px-4 gap-8">
            <div className="self-stretch flex flex-row items-center justify-start gap-2">
              <div className="flex-1 flex flex-row items-center justify-start py-0 pl-0 pr-[85px] gap-[5px]">
                <div className="h-8 w-8 rounded-[66.67px] border-primary-color border-[0.7px] border-solid box-border overflow-hidden shrink-0 flex flex-row items-center justify-center pt-1.5 px-0.5 pb-0 relative">
                  <img
                    className="h-[27.3px] w-[27.3px] absolute !m-[0] top-[6px] left-[2.3px]"
                    loading="lazy"
                    alt=""
                    src="/vuesaxbolduser.svg"
                  />
                </div>
                <a className="[text-decoration:none] h-3 relative tracking-[0.01em] leading-[24px] font-medium text-[inherit] inline-block">
                  Welcome! James
                </a>
              </div>
              <div className="h-8 w-8 rounded-[100px] flex flex-row items-center justify-center p-1 box-border">
                <img
                  className="h-6 w-6 relative"
                  loading="lazy"
                  alt=""
                  src="/vuesaxlinearnotification.svg"
                />
              </div>
            </div>
            <div className="self-stretch rounded border-sg-sys-color-outline border-[0.4px] border-solid flex flex-col items-start justify-start">
              <div className="self-stretch flex flex-col items-start justify-center p-4 gap-5">
                <div className="flex flex-row items-center justify-start gap-0.5">
                  <img
                    className="h-5 w-5 relative"
                    loading="lazy"
                    alt=""
                    src="/vuesaxlinearticksquare.svg"
                  />
                  <div className="relative tracking-[0.01em] leading-[12px]">
                    Matched scholarships
                  </div>
                </div>
                <div className="self-stretch flex flex-row items-center justify-start gap-2.5 text-12xl-3">
                  <div className="flex-1 relative leading-[23px] font-semibold">
                    0
                  </div>
                  <img
                    className="h-5 w-5 relative hidden"
                    alt=""
                    src="/vuesaxlineararrowright.svg"
                  />
                </div>
              </div>
              <div className="self-stretch h-[0.4px] bg-sg-sys-color-outline" />
              <div className="self-stretch flex flex-col items-start justify-center p-4 gap-5">
                <div className="flex flex-row items-center justify-start gap-px">
                  <img
                    className="h-5 w-5 relative"
                    loading="lazy"
                    alt=""
                    src="/vuesaxlinearclock.svg"
                  />
                  <div className="relative tracking-[0.01em] leading-[12px]">
                    Upcoming deadlines
                  </div>
                </div>
                <div className="self-stretch flex flex-row items-center justify-start gap-2.5 text-12xl-3">
                  <div className="flex-1 relative leading-[23px] font-semibold">
                    0
                  </div>
                  <img
                    className="h-5 w-5 relative hidden"
                    alt=""
                    src="/vuesaxlineararrowright.svg"
                  />
                </div>
              </div>
              <div className="self-stretch h-[0.4px] bg-sg-sys-color-outline" />
              <div className="self-stretch flex flex-col items-start justify-center p-4 gap-5 z-[1]">
                <div className="flex flex-row items-center justify-start gap-0.5">
                  <img
                    className="h-5 w-5 relative"
                    loading="lazy"
                    alt=""
                    src="/vuesaxlinearfolder.svg"
                  />
                  <div className="relative tracking-[0.01em] leading-[12px]">
                    Saved scholarships
                  </div>
                </div>
                <div className="self-stretch flex flex-row items-center justify-start gap-2.5 text-12xl-3">
                  <div className="flex-1 relative leading-[23px] font-semibold">
                    0
                  </div>
                  <img
                    className="h-5 w-5 relative hidden"
                    alt=""
                    src="/vuesaxlineararrowright.svg"
                  />
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col items-start justify-start gap-3">
              <div className="self-stretch h-3 relative tracking-[0.01em] leading-[24px] font-medium inline-block">
                Application progress
              </div>
              <div className="self-stretch rounded border-sg-sys-color-outline border-[0.4px] border-solid flex flex-col items-start justify-start">
                <ApplicationLabels
                  applicationsInProgress="Applications in progress"
                  vuesaxlineararrowRight="/vuesaxlineararrowright.svg"
                  showApplicationLabels
                />
                <div className="self-stretch h-[0.4px] bg-sg-sys-color-outline" />
                <ApplicationLabels
                  applicationsInProgress="Applications completed"
                  vuesaxlineararrowRight="/vuesaxlineararrowright.svg"
                  showApplicationLabels
                  propHeight="unset"
                  propDisplay="unset"
                />
                <div className="self-stretch h-[0.4px] bg-sg-sys-color-outline hidden" />
                <ApplicationLabels
                  applicationsInProgress="Total applications pending"
                  vuesaxlineararrowRight="/vuesaxlineararrowright.svg"
                  showApplicationLabels={false}
                  propHeight="23px"
                  propDisplay="inline-block"
                />
              </div>
            </div>
            <div className="self-stretch rounded border-sg-sys-color-outline border-[0.4px] border-solid hidden flex-col items-start justify-start">
              <div className="self-stretch flex flex-col items-start justify-center p-4 gap-5">
                <div className="w-48 flex flex-row items-center justify-start gap-0.5">
                  <img
                    className="h-5 w-5 relative"
                    alt=""
                    src="/vuesaxlinearticksquare-1.svg"
                  />
                  <div className="h-3 flex-1 relative tracking-[0.01em] leading-[24px] inline-block">
                    Matched scholarships
                  </div>
                </div>
                <div className="self-stretch flex flex-row items-center justify-start gap-2.5 text-12xl-3">
                  <div className="h-[23px] flex-1 relative leading-[36px] font-semibold inline-block">
                    0
                  </div>
                  <img
                    className="h-5 w-5 relative"
                    alt=""
                    src="/vuesaxlineararrowright.svg"
                  />
                </div>
              </div>
              <div className="self-stretch h-[0.4px] bg-sg-sys-color-outline" />
              <div className="self-stretch flex flex-col items-start justify-center p-4 gap-5">
                <div className="w-[180px] flex flex-row items-center justify-start gap-px">
                  <img
                    className="h-5 w-5 relative"
                    alt=""
                    src="/vuesaxlinearclock-1.svg"
                  />
                  <div className="h-3 flex-1 relative tracking-[0.01em] leading-[24px] inline-block">
                    Upcoming deadlines
                  </div>
                </div>
                <div className="self-stretch flex flex-row items-center justify-start gap-2.5 text-12xl-3">
                  <div className="h-[23px] flex-1 relative leading-[36px] font-semibold inline-block">
                    0
                  </div>
                  <img
                    className="h-5 w-5 relative"
                    alt=""
                    src="/vuesaxlineararrowright-1.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <NavBar />
    </div>
  );
};

