export default function Footer() {
    return (
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlogSphere. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }
  