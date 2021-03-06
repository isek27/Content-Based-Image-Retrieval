import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions";
import ImageSelector from "../Components/ImageSelector";
import axios from "axios";

var imageStyle = {
    height: '300px',
    width: '250px'
}

var inlineStyle={
    display:'inline-block'
}

class IntensityMethod extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            selectedImage: null,
        };
    }

    componentWillMount() {
        this.loadHistogram();
    }

    async loadHistogram() {
        const histogram = await axios.get("/api/histogram?method=" + "intensity");
        this.setState({buckets:histogram.data});
    }

    async getResults(img) {
        if(!this.state.buckets) {
            this.loadHistogram();
        }
        else {
            const results = await axios.post("/api/findDistances", {image: img, buckets: this.state.buckets});
            this.setState({results: results.data});
        }
    }

    selectImage(img) {
        this.setState({selectedImage: img});
        this.getResults(img);
    }

    renderSelectImages() {
        if(!this.state.buckets)
            return <div>Loading...</div>;
        return (
            <div><ImageSelector selectImage={(img) => this.selectImage(img)} /></div>
        );
    }

    renderContent() {
        if(this.state.results) {
            return (<div>{this.renderResults()}</div>);
        }
        else {
            return this.renderSelectImages();
        }
    }

    renderResults() {
        return (
            <div style={{marginTop: '25px', textAlign:'center'}}>
                <div>
                    <div className="btn"  style={inlineStyle} onClick={() => this.setState({results:null})}>Results for image {this.state.selectedImage}</div>
                    <div className="btn red ml-2" onClick={() => this.setState({results:null})}>Go Back</div>
                </div>
                <div style={{marginTop:'15px'}}>
                    {this.renderImageResults()}
                </div>
                <button className="btn red" style={{marginTop:'15px', marginBottom:'15px'}} onClick={() => this.setState({results:null})}>Back</button>
            </div>
        );
    }

    renderImageResults() {
        const resultImages = [];
        for(let i = 0; i < 100; i+=5) {
            resultImages.push(
                <div key={i}>
                    <div style={inlineStyle} className="card">
                        <div className="card-image">
                            <img style={imageStyle} src={process.env.PUBLIC_URL + '/images/' + (this.state.results[i].index) + '.jpg'} alt={i}/>
                            <span className="card-title">Image {this.state.results[i].index}</span>
                        </div>
                    </div>
                    <span className="mr-2"/>
                    <div style={inlineStyle}  className="card" >
                        <div className="card-image">
                            <img style={imageStyle} src={process.env.PUBLIC_URL + '/images/' + (this.state.results[i + 1].index)  + '.jpg'} alt={i + 1} />
                            <span className="card-title">Image {this.state.results[i + 1].index}</span>
                        </div>
                    </div>

                    <span className="mr-2"/>
                    <div style={inlineStyle}  className="card" >
                        <div className="card-image">
                            <img style={imageStyle} src={process.env.PUBLIC_URL + '/images/' + (this.state.results[i + 2].index)  + '.jpg'} alt={i + 2} />
                            <span className="card-title">Image {this.state.results[i + 2].index}</span>
                        </div>
                    </div>

                    <span className="mr-2"/>
                    <div style={inlineStyle}  className="card" >
                        <div className="card-image">
                            <img style={imageStyle} src={process.env.PUBLIC_URL + '/images/' + (this.state.results[i + 3].index)  + '.jpg'}  alt={i + 3} />
                            <span className="card-title">Image {this.state.results[i + 3].index}</span>
                        </div>
                    </div>

                    <span className="mr-2"/>
                    <div style={inlineStyle}  className="card" >
                        <div className="card-image">
                            <img style={imageStyle} src={process.env.PUBLIC_URL + '/images/' + (this.state.results[i + 4].index)  + '.jpg'}  alt={i + 4} />
                            <span className="card-title">Image {this.state.results[i + 4].index}</span>
                        </div>
                    </div>
                </div>
            )
        }
        return resultImages;
    }

    renderHelpMessage() {
        if(this.state.selectedImage < 1) {
            return <div>Select an image to get started!</div>;
        }
    }

    render() {
        return (
            <div style={{marginTop:'25px'}}>
                <div><h4>Method: Intensity</h4></div>
                {this.renderHelpMessage()}
                {this.renderContent()}
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        auth : state.auth
    };
}

export default connect(mapStateToProps, actions)(IntensityMethod);
