export function Footer() {
  return (
    <footer className="max-w-[680px] mx-auto px-6 pt-10 pb-24 border-t border-border-subtle">
      {/* Attribution */}
      <p className="text-[13px] text-text-faint text-center">
        Designed &amp; built by Ajin.
      </p>
      <p className="text-[12px] text-text-faint text-center mt-1">
        © {new Date().getFullYear()}. All rights reserved.
      </p>
    </footer>
  )
}
