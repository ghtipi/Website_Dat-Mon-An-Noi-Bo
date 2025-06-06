const Footer = () => {
  return (
    <footer className="bg-teal-700 text-white py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} TipiFood. All rights reserved.</p>
        <div className="mt-2">
          <a href="/about" className="hover:underline mx-2">Về Chúng Tôi</a>
          <a href="/contact" className="hover:underline mx-2">Liên Hệ</a>
          <a href="/policy" className="hover:underline mx-2">Chính Sách</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
