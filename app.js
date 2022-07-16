const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const path = require("path");
const databasePath = path.join(__dirname, "moviesData.db");
app.use(express.json());
let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`Db error:${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObjectAndResponseMovie=(dbObject)=>{
    return{
        movieId:dbObject.movie_id;
        directorId:dbObject.director_id;
        movieName:dbObject.movie_name;
        leadActor:dbObject.lead_actor;
    }
};

const convertDbObjectAndResponseDirector=(dbObject)=>{
    return{
        directorId:dbObject.director_id;
        directorName:dbObject..director_name;
    }
};


app.get("/movies/",async (request,response)=>{
    const movieDetails=`select * from movie;`;
    const movieArray=await database.all(movieDetails);
    response.send(movieArray.map((eachMovie)=>({movieName:eachMovie.movie_name})));

});
app.post("/movies/",async(request,response)=>{
    const { directorId, movieName, leadActor } = request.body;
    const addMovieQuery=`insert into movie(director_id,movie_name,lead_actor)
                        values (${directorId},'${movieName}','${leadActor}');`;
    const dbresponse=await database.run(addMovieQuery);
    response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/",async(request,response)=>{
    const {movieId}=request.params;
    const movieQuery=`select * from movie where movie_id=${movieId};`;
    const movie=await database.get(movieQuery);
    response.send(convertDbObjectAndResponseMovie(movie));
});

app.put("/movies/:movieId/",async(request,response)=>{
    const { directorId, movieName, leadActor } = request.body;
    const {movieId}=request.params;
    const updateMovieQuery=`
                           update 
                                  movie 
                           set 
                                 director_id=${directorId},
                                 movie_name=${movieName},
                                 lead_actor=${leadActor} 
                           where
                                 movie_id=${movieId};`;
    await database.run(updateMovieQuery);
    response.send("Movie Details Updated");
});


app.delete("/movies/:movieId/",async(request,response)=>{
    const {movieId}=request.params;
    const deleteQuery=`delete from movie 
                        where
                                 movie_id=${movieId};`;
    await database.run(deleteQuery);
    response.send("Movie Removed");
)};

app.get("/directors/",(request,response)=>{
    const directorDetails=`select * from director;`;
    const directorArray=await.database.all(directorDetails);
    response.send(directorArray.map((eachDirector)=>convertDbObjectAndResponseDirector(eachDirector)));
});

app.get("/directors/:directorId/movies/",(request,response)=>{
    const {directorId}=request.params;
    const getDirectorNames=`select movie_names
                            from director
                            where director_id='${directorId}';`;

    const movieArray=await.database.all(getDirectorNames);
    response.send(movieArray.map((eachMovie)=>({ movieName: eachMovie.movie_name }))
  );
});

module.exports=app;