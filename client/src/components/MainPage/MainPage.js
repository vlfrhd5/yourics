import React from 'react';
import axios from 'axios';
import './css/MainPage.css';


class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clickAvoid: false,  // 중복 클릭 방지
            searchValue: '',    // 검색 창 value
            videoName: null,    // 검색 결과
            videoId: null,      // 노래 ID 값
            lyrics: ''          // 노래 가사
        }
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
    }

    componentDidMount() {
        
    }

    // input 에 텍스트 입력시 state 값 변경
    searchChange(event) {
        this.setState({ searchValue: event.target.value })
    }

    // 검색 버튼 클릭 시 영상 호출되도록 구현
    async searchSubmit(event) {
        this.setState({
            clickAvoid: true,
            videoName: this.state.searchValue,  // 영상 제목 state 값 반영
            searchValue: ''
        });

        await event.preventDefault();

        // 빈 칸 또는 공백으로 검색할 경우 영상 재생 X
        const blankReg = /\s{1,}/g;
        const stringReg = /(\S)\w*/g;
        const blankRegExp = blankReg.test(this.state.videoName);
        const stringRegExp = stringReg.test(this.state.videoName);

        if (this.state.videoName === '' || (blankRegExp && !stringRegExp)) {
            this.setState({ clickAvoid: false });
            return null

        }

        const lyricsLoad = await axios.post('http://localhost:5000/crawling/lyricsLoad', {
            song: this.state.videoName
        })

        this.setState({ lyrics: lyricsLoad.data })

        await axios.post('http://localhost:5000/youtube/search', {
            song: this.state.videoName

        }).then(result => {
            this.setState({ videoId: result.data });

        }).then(() => {
            setTimeout(() => {
                this.setState({ clickAvoid: false });

            }, 1000);

        }).catch(err=>{console.log('video ID loading Error', err)})
        
    }

    render() {
        const { clickAvoid, searchValue, videoId, lyrics } = this.state;

        return (
            <div className="cotainer-main0">
                <div className="backhome">
                    <a href="http://localhost:3000/">
                        <img src="/images/ufo.png" alt="move home"></img>
                    </a>
                </div>

                <div className="container-main">
                    {/* 로고, 노래검색 */}
                    <header>
                        <div className="logo">
                            <center>
                                <img src="/images/main_logo.png" alt="Yourics" /> 
                            </center>
                        </div>

                        <div className="search">
                            <form onSubmit={this.searchSubmit}>
                                <input type="text" value={searchValue} onChange={this.searchChange} className="search-box"/>
                                {
                                    !clickAvoid ?
                                    <input type="submit" value=" " className="img-button" />
                                    :
                                    <input type="submit" disabled value="검색중..." className="img-button2"/>
                                }
                            </form>
                        </div>
                    </header>

                    {/* 동영상, 가사 */}
                    <div className="main-div">
                        <div className="videoimage">
                            <img src="/images/tv_image3.png" alt="tv"/>
                        </div>

                        <div className="video">
                            {
                                videoId && <iframe title="song" width="600" height="375" id="YT_Video" 
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen> 
                                </iframe>
                            }
                        </div>

                        <div className="lyrics">
                            <span className="content">
                                {
                                    lyrics.split('<br>').map( (line,idx) => {
                                        return <span key={idx}>
                                            {line}<br/>
                                        </span>
                                    })
                                }
                            </span>
                        </div>
                    </div>

                    {/* SNS 공유 */}
                    <footer>
                        <div className="copyright">
                            Copyright 2020. M&P All rights reserved.
                           {/*  <li><img src="/images/sns_insta.png" alt="insta" /></li>
                            <li><img src="/images/sns_fb.png" alt="facebook" /></li>
                            <li><img src="/images/sns_kakao.png" alt="kakaotalk" /></li>
                            <li><img src="/images/sns_twitter.png" alt="twitter" /></li> */}
                        </div>
                    </footer>
                </div>
            </div>    
        ) 
    }
}

export default MainPage;