// import "./featured.css";
// import { useFetch } from "../../hooks/useFetch";
// const Featured = () => {
//   const { data = [], error, loading } = useFetch(
//     "/hotels/countByCity?cities=Lucknow,Delhi,Jaipur,Bangalore"
//   );
//   console.log(data);
  
//   console.log("city"+data.countByCity);
//   console.log("city"+data.countByType);
  
//   if (error) console.error("Fetch error:", error);
//   if (loading) console.log("Loading...");
//   console.log("Hotel counts:", data);
  
//   return (
//     <div className="featured">
//       <div className="featuredItem">
//         <img
//           src="https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
//           alt=""
//           className="featuredImg"
//         />
//         <div className="featuredTitles">
//           <h1>Dublin</h1>
//           <h2>123 properties</h2>
//         </div>
//       </div>


//       <div className="featuredItem">
//         <img
//           src="https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o="
//           alt=""
//           className="featuredImg"
//         />
//         <div className="featuredTitles">
//           <h1>Reno</h1>
//           <h2>533 properties</h2>
//         </div>
//       </div>
//       <div className="featuredItem">
//         <img
//           src="https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
//           alt=""
//           className="featuredImg"
//         />
//         <div className="featuredTitles">
//           <h1>Austin</h1>
//           <h2>532 properties</h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Featured;



import "./featured.css";
import { useFetch } from "../../hooks/useFetch";

const Featured = () => {
  const { data, error, loading } = useFetch(
    "/hotels/countByCity?cities=Lucknow,Delhi,Jaipur,Bangalore"
  );

  if (error) console.error("Fetch error:", error);

  return (
    <div className="featured">
      {loading ? (
        "Loading..."
      ) : (
        <>
          <div className="featuredItem">
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Lucknow</h1>
              <h2>{data[0]} properties</h2>
            </div>
          </div>

          <div className="featuredItem">
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Delhi</h1>
              <h2>{data[1]} properties</h2>
            </div>
          </div>
          <div className="featuredItem">
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Jaipur</h1>
              <h2>{data[2]} properties</h2>
            </div>
          </div>
          <div className="featuredItem">
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Bangalore</h1>
              <h2>{data[3]} properties</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;