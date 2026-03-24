const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          © 2024 <span className="text-primary">Jesus Monroig</span>. All rights reserved.
        </div>
        <div className="text-sm text-muted-foreground font-mono">
          Built with passion & code
        </div>
      </div>
    </footer>
  );
};

export default Footer;
