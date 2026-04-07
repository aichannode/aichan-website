import { useSocialProfile } from "@/hooks/useSocialProfile";
import { getFooterSocialLinks } from "@/utils/social-footer-links";

const Footer = () => {
  const { profile } = useSocialProfile();
  const socialLinks = getFooterSocialLinks(profile);
  const ownerName = profile.fullname?.trim() || "Hector Rosado";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
            © {year} <span className="text-primary">{ownerName}</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end sm:gap-2">
            {socialLinks.map(({ key, href, label, Icon }) => {
              const isExternal = href.startsWith("http");
              return (
                <a
                  key={key}
                  href={href}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={label}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-all duration-300 hover:bg-muted/60 hover:text-primary"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
