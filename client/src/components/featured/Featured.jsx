import "./featured.css";
import useFetch from "../../hooks/useFetch";

const Featured = () => {
  const { data, error, loading } = useFetch(
    "/hotels/countByCity?cities=Lucknow,Delhi,Jaipur,Bangalore"
  );

  console.log("API Response:", data);

  if (loading) {
    return <div className="featured">Loading...</div>;
  }

  if (error) {
    return <div className="featured">Error loading data: {error.message}</div>;
  }

  const cities = [
    {
      name: "Lucknow",
      image: "https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
    },
    {
      name: "Delhi", 
      image: "https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o="
    },
    {
      name: "Jaipur",
      image: "https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
    },
    {
      name: "Bangalore",
      image: "https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
    }
  ];

  return (
    <div className="featured">
      {cities.map((city, index) => (
        <div className="featuredItem" key={city.name}>
          <img
            src={city.image}
            alt={city.name}
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>{city.name}</h1>
            <h2>{data[index] || 0} properties</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Featured;