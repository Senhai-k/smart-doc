"""会议纪要结构化抽取"""
import json
from openai import OpenAI
from app.config import Config

client = OpenAI(
    api_key=Config.DEEPSEEK_API_KEY,
    base_url=Config.DEEPSEEK_BASE_URL
)

MEETING_EXTRACT_PROMPT = """
你是一位专业的会议纪要整理助手。请从以下会议记录中提取结构化信息，严格按照 JSON 格式返回。

返回格式：
{
  "meeting_topic": "会议主题",
  "date": "会议日期（如果能提取到）",
  "attendees": ["参会人1", "参会人2"],
  "conclusion": "会议结论摘要（50字以内）",
  "action_items": [
    {"task": "待办事项描述", "assignee": "负责人", "deadline": "截止日期"}
  ]
}

如果某项信息不存在，填写 null 或空数组。

会议记录内容：
"""

def extract_meeting_info(text):
    """从会议记录中提取结构化信息"""
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是专业的会议纪要整理助手，只返回 JSON 格式，不要有其他内容。"},
                {"role": "user", "content": MEETING_EXTRACT_PROMPT + text}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        
        result = response.choices[0].message.content
        # 清理可能的 markdown 代码块标记
        result = result.replace("```json", "").replace("```", "").strip()
        return json.loads(result)
    except Exception as e:
        return {
            "meeting_topic": None,
            "date": None,
            "attendees": [],
            "conclusion": f"解析失败: {str(e)}",
            "action_items": []
        }