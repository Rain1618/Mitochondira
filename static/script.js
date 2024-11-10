document.addEventListener('DOMContentLoaded', () => {
    console.log('Document is ready');

    document.getElementById("predictButton").addEventListener("click", uploadAndPredict);

    async function uploadAndPredict() {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];

        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const statusMessage = document.getElementById("statusMessage");
        statusMessage.textContent = "Getting predictions...";  

        // Simulate a delay
        setTimeout(() => {
            document.getElementById('statusMessage').innerText = "Prediction complete!";

            document.getElementById('graphResult').innerHTML = `
                <img src="../static/uploads/graph.png" alt="Predicted Graph" class="img-fluid">
            `;
            document.getElementById('predictionResult').innerText = `Predicted Result:\n
            [0.06759261339902878,
                0.1616547703742981,
                0.10763105005025864,
                0.06941597908735275,
                0.06179719418287277,
                0.06189341098070145,
                0.12081407010555267,
                0.057802069932222366,
                ...
                0.06815511733293533,
                0.05437159538269043]`; // TODO: Replace with actual result
            // Show the download button
            document.getElementById('downloadBtn').style.display = 'block';

            // Set up the download of prediction result as text
            //document.addEventListener('DOMContentLoaded', function () {
            document.getElementById('downloadTextBtn').addEventListener('click', () => {
                const resultText = `[0.06759261339902878,
                    0.1616547703742981,
                    0.10763105005025864,
                    0.06941597908735275,
                    0.06179719418287277,
                    0.06189341098070145,
                    0.12081407010555267,
                    0.057802069932222366,
                    ...
                    0.06815511733293533,
                    0.05437159538269043]`; 

                const blob = new Blob([resultText], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'prediction_result.txt'; // Specify the filename for the text file
                link.click(); 
            });
        }, 2500); 

    }
});



// document.addEventListener('DOMContentLoaded', () => {
//     console.log('Document is ready');

//     document.getElementById("predictButton").addEventListener("click", uploadAndPredict);

//     async function uploadAndPredict() {
//         const fileInput = document.getElementById("fileInput");
//         const file = fileInput.files[0];
    
//         if (!file) {
//             alert("Please select a file to upload.");
//             return;
//         }

//         const statusMessage = document.getElementById("statusMessage");
//         statusMessage.textContent = "Getting predictions...";  

//         // Simulate a delay 
//         setTimeout(() => {
//         document.getElementById('statusMessage').innerText = "Prediction complete!";
//         setTimeout(() => {
//             document.getElementById('statusMessage').innerText = "Prediction complete!";
            
//             // Display the prediction result below the button
//             document.getElementById('predictionResult').innerText = "Predicted Result: [Your result here]"; // TODO: Replace with actual result
//         }, 2000);

//     })

//         // console.log('fileInput is: ');
//         // console.log(fileInput);
//         // console.log('file is ');
//         // console.log(file);

//         // const formData = new FormData();
//         // formData.append("pdb_file", file);
    
//         // try {
//         //     const response = await fetch("http://127.0.0.1:8080/predict/", {
//         //         method: "POST",
//         //         body: formData
//         //     });
    
//         //     if (!response.ok) {
//         //         const errorData = await response.json();
//         //         throw new Error(errorData.detail);
//         //     }
    
//         //     const data = await response.json();
//         //     displayPredictions(data.predictions);
    
//         // } catch (error) {
//         //     console.error("Error:", error);
//         //     alert("An error occurred: " + error.message);
//         // }
//     // }
    
//     // function displayPredictions(predictions) {
//     //     const predictionList = document.getElementById("predictionList");
//     //     predictionList.innerHTML = "";  // Clear previous predictions
    
//     //     predictions.forEach((prediction, index) => {
//     //         const listItem = document.createElement("li");
//     //         listItem.textContent = `Prediction ${index + 1}: ${prediction}`;
//     //         predictionList.appendChild(listItem);
//     //     });
//     // }
    


// // });

