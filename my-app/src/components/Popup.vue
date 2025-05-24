<script setup>


defineProps({
  title: String,
  body: String,
  imagesrc: String,
})


</script>


<template>
    <div class="main">

        <img :src="imagesrc" alt="image of monument">

        <div>
            <h2>{{ title }}</h2> 
            <p> {{ body }}</p>
        </div>
    </div>
 
</template>

<style scoped>
    .main{
        background-color: rgb(67, 46, 250);
        border-radius: 10%;
        color : white;
        text-align: left;
        width:500px;
        height: 300px;
        overflow: hidden;
        

    }


    .main div{
        height:60%;
        margin:0;
        padding: 0;
        
    }

    .main div h2{
        margin:0;
        margin-left: 5px;
        margin-right: 5px;
    }

    .main div p{
        margin:0;
        margin-left: 5px;
        margin-right: 5px;
    }

    .main img{
        width : 100%;
        height: 40%;
        
        
        object-fit: cover;
        

    }

    

</style>
