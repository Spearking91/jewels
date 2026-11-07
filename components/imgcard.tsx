

const Imgcard = ({ src, alt, style="w-70 h-90"}: { src: string, alt:string, style: any}) => {
  return (
    <div className={`border border-gray-300 rounded-xl ${style} mt-5`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export default Imgcard;
