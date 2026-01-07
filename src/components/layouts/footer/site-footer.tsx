export function SiteFooter() {
  return (
    <footer className="text-base-white font-quicksand bg-base-primary-dark sticky bottom-0 z-40 mt-auto flex h-(--footer-height) shrink-0 items-center border-t px-2 text-xs leading-[100%] font-medium tracking-[0] group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--footer-height) lg:px-4">
      <div className="flex w-full items-center justify-between">
        <span>© {new Date().getFullYear()} LIMOSPRO INC</span>
        <div className="flex items-center">
          <span>
            Design & Developed by{" "}
            <a
              href="https://qalbit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              QALBIT
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
