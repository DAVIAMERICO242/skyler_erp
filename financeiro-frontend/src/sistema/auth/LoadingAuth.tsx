import LinearProgress from '@mui/material/LinearProgress';
import './auth.css'

export const LoadingAuth = ()=>{
    return (
        <LinearProgress sx={{
            backgroundColor: 'gray',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#0c2846'
            }
          }} className="authing_page"/>
    );
}