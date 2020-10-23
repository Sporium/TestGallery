import React , {useState, useEffect} from 'react';
import Dexie from "dexie";

const Main = (props) => {
    
    //set the database 
    const db = new Dexie("ReactDexie");
    //create the database store
    db.version(1).stores({
        posts: "title, content, file, type, width, collection"
    })
    db.open().catch((err) => {
        console.log(err.stack || err)
    })
    
    //set the state and property
    const [postTitle, setTitle] = useState("");
    const [postContent, setContent] = useState("");
    const [postFile, setFile] = useState("");
    const [posts, setPosts] = useState("");
    const [type, setType] = useState("");
    const [width, setWidth] = useState(0);
    const [size, setSize] = useState(0);
    const [lastModified, setLastModified] = useState(0);
    const [memory, setMemory] = useState({});
    const [searchTitle, setSearchTitle] = useState('');
    const [found, setFound] = useState(false);
 
 
    

    // const [updates, setUpdate] = useState(0);
    //read the file and decode it
    const getFile = (e) => {
        console.log('set:',e)
    //  debugger
        setType(e[0].type)
        // debugger
        setTitle(e[0].name.split(".")[0])
        setSize(e[0].size)
        setLastModified(e[0].lastModifiedDate.toString())
        let reader = new FileReader();
      
        reader.readAsDataURL(e[0]);
       
        reader.onload= (e) => {
            setFile(reader.result);
        }
    }
  // guess what this function do
    const deletePost = async(id) => {
        console.log(id);
        db.posts.delete(id);
        debugger
        let allPosts = await db.posts.toArray();
        //set the posts
        setPosts(allPosts);
    }
   const deleteDB = async () => {
       debugger
    await db.delete().then(() => {
        console.log("Database successfully deleted");
    }).catch((err) => {
        console.error("Could not delete database");
    }).finally(() => {
        
        //set the posts
        setPosts(0);
       console.log("finale");
    });
   }
    let post = {
        title: postTitle,
        content: postContent,
        file: postFile,
        type: type,
        width:width,
        size: size,
        lastModified:lastModified
    }

    //submit 
    const getPostInfo = (e) => {
       
        e.preventDefault();
        if(postTitle !== "" && postContent !== "" && postFile !== ""){
           
           debugger

            db.posts.add(post).then(async() => {
                //retrieve all posts inside the database
                let allPosts = await db.posts.toArray();
                //set the posts
                setPosts(allPosts);
            });
            
        }
      
    }
  
    const updateDB = (e,key) => {
       
    
       db.posts.delete(key)
       db.posts.add(post)
     
     // title didt update this way... 
        // db.posts.update(key,{content: post.content})
        // db.posts.update(key,{file: post.file})
        // db.posts.update(key,{lastModified: post.lastModified})
        // db.posts.update(key,{size: post.size})
        
        // db.posts.update(key,{type: post.type})
        // db.posts.update(key,{width: post.width})
        
         // db.posts.update(key,{title: "post.title"})
    }
    useEffect(() => {
        // console.log(React.findDOMNode(this.refs))
        //get all posts from the database
  //   debugger
        const getPosts = async() => {
            let allPosts = await db.posts.toArray();
            setPosts(allPosts);
        }
      
        getPosts();
     
    },[])
   
      //  const [memory, setMemory] = useState({});
        useEffect(() => {
            const getMemmory = async() => {
              //  setIsLoading(true);
                const mem =  await navigator.storage.estimate()
                setMemory(mem)
              //  setIsLoading(false);
            }

        // const getMemmory = async() => {
        //  let mem = await navigator.storage.estimate()
        //      //    console.log("MEMORY:",estimate.usage/1024/1024/1024)
        //        setMemory(mem)
        //  }
             getMemmory();
    },[posts])
  
   // let postData;
  useEffect(()=> {
    console.log(searchTitle)
    setFound(false)
    db.posts.where("title").equalsIgnoreCase(searchTitle).each(function (friend) {
        debugger
        if(friend){
            console.log("friend");
            setFound(true)
        }
       
        // debugger
    }).catch(function (error) {
        console.error(error);
    });
  },[db.posts, searchTitle])

   // render result of search
  let searchResult
  if (searchTitle.length>0 && found){
      searchResult = <div className="search-result search-result__found">found</div>
  }
  else if (searchTitle.length===0){
    searchResult = <div className="search-result__none"></div>
  }
  else {
    searchResult = <div className="search-result search-result__not-found">Not found</div>
  }

  let  data = Array.from(posts)
  console.log(posts)
    return (
    <React.Fragment>
          <div className="main__stats"> 
          <div className="search__container">
          {searchResult}    
              {/* {found? <div>found</div> : <div>notFound</div>} */}
          <textarea name="search" id="search" placeholder="Type Title to search for" cols="30" rows="1" onChange={(e)=>{
            //   debugger
              setSearchTitle(e.target.value)
          }}></textarea>
          {/* <button className="clear__btn" onClick={search}>Search</button> */}
          </div>
            Total Memory: {memory.quota/1000000} Mb <br/>
            Memory used: {memory.usage/1000000} Mb in  {posts.length} files <br/>
            Free memory: {(memory.quota-memory.usage)/1000000} Mb <br/>
            <button className="clear__btn" onClick={deleteDB}>Clear database</button>
    {/* You’re currently using about {(memory.usage/memory.quota)*100}% of your available storage. */}
</div>
<div >
       
        <form  className="submit" onSubmit={getPostInfo}>
           <div className="control">
           {/* <label>Title</label> */}
            {/* <input type="text" name="title"  onChange={e => setTitle(e.target.value)} /> */}
           </div>
           <div className="control">
           <label >Description</label>
            <textarea className="content" placeholder="Please put description of file" name="content"  onChange={e => setContent(e.target.value)} />
           </div>
           <div className="control__button">
            <label htmlFor="cover " className="cover ">Choose a file</label>
            <input type="file" id="cover" name="file" className="update-file__input" onChange={e => { 
            //  debugger
                getFile(e.target.files)
            }
                } />
           </div>
            
            <input type="submit" value="Submit" />
        </form>
        <div className="posts__container">
              {
                        data.map((post,index) => {
                            
                             return <div className="post" key={post.title}>
                                        {/* <div style={{backgroundImage: "url(" + post.file + ")" }} /> */}
                                        {/* Holy guacamole! JS can get width and height of image only when its loaded...
                                         so i just load this with display:none > get properties and then render 
                                         another image with different style -_-*/}
                                   <div>    <img className="displayNone" src={post.file} onLoad={(e) => {setWidth(e.target.width)
                                    
                                    let para = document.createElement("P");                      
                                    // Create a text node
                                    let t = document.createTextNode(e.target.height+" x "+e.target.width) ;  
                                    let format 
                                    if(e.target.height===e.target.width){
                                         format = document.createTextNode("   It's a square!")
                                    }    
                                    else if (e.target.height>e.target.width){
                                         format = document.createTextNode("   This is a portrait!")
                                    }
                                    else { format = document.createTextNode("   This is an album!")
                                    }
                                    para.appendChild(t);  
                                    para.appendChild(format);  
                                    e.target.parentNode.append(para)
                                        }} alt={post.title}/>
            <img className="display" src={post.file} alt={post.title}></img>
       
            <h2>Title: {post.title.split('.')[0]}</h2>
            <p>{post.content}</p>
            <p> {post.type}</p>
            <p> {(post.size/1024/1024).toFixed(2)} MB</p>
            <p>Last modified: {post.lastModified}</p>
            </div>
        <div className="post__control">   
        <div className="div__button post-btn__control">
         <button className="delete" onClick={() => deletePost(post.title)}>Delete</button>
         <a href={post.file} download={`${post.title}.${post.type.split('/')[1]}`}>Download</a>
         </div>
        <form  onSubmit={(e)=>{
        updateDB(e,post.title) }
        }>
        <textarea className="content" placeholder="Please put NEW description of file" name="content" onChange={e => setContent(e.target.value)} />
        <div className="div__button update-file__control">                                  
        <label className="cover update-file__label">Choose a file</label>
          <input placeholder="Upload File" type="file" name="file" className="update-file__input" onChange={e => { 
              //debugger
                getFile(e.target.files)
            }
                } >
        </input>
    
       </div>
       <div className="update-file__submit div__button">
       <input type="submit" value="Update" />
       </div>
        </form>
        </div>
        </div>       
                       })
                    }
                    </div>
       <div></div>
             </div>
    </React.Fragment>
  );
}

export default Main;
