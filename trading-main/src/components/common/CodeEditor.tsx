import { useEffect, useRef } from 'react'
import { Box, Paper } from '@mui/material'

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  language: string
  height: string
}

// 간단한 코드 에디터 컴포넌트
// 실제 프로젝트에서는 Monaco Editor나 CodeMirror와 같은 
// 전용 라이브러리를 추가하여 사용하는 것이 좋습니다.
function CodeEditor({ code, onChange, language, height }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = code
    }
  }, [code])

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box
        component="textarea"
        ref={textareaRef}
        sx={{
          width: '100%',
          height,
          fontFamily: 'monospace',
          fontSize: '14px',
          padding: 2,
          border: 'none',
          resize: 'none',
          outline: 'none',
          bgcolor: 'background.paper',
        }}
        defaultValue={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`// ${language} 코드를 입력하세요`}
      />
    </Paper>
  )
}

export default CodeEditor 