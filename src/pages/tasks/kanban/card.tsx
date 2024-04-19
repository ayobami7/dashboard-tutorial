import { Text } from '@/components/text'
import { User } from '@/graphql/schema.types'
import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons'
import { Card, ConfigProvider, Dropdown, MenuProps, Tag, theme } from 'antd'
import React, { useMemo } from 'react'

type ProjectCardProps ={
    id: string,
    title: string,
    updatedAt: string,
    dueDate?: string,
    users?:{
        id: string,
        name: string,
        avatarUrl?: User['avatarUrl']
    } []
}

const ProjectCard = ({id, title, dueDate, users}: ProjectCardProps) => {

    const {token} = theme.useToken();

    const edit = () => {}

    const dropdownItems = useMemo(()=>{
        const dropdownItems: MenuProps['items'] =[
            {
                label: 'View card',
                key: '1',
                icon: <EyeOutlined/>,
                onClick: () => {
                    edit()
                }
            },
            {
                danger: true,
                label: 'Delete card',
                key: '2',
                onClick: ()=> {}
            }
        ]
        return dropdownItems
    }, [])

    const dueDateOptions = useMemo( ()=>{
        if(!dueDate)
            return null;

        const date = dayjs(dueDate);
        return {
            color: getDateColor({date:dueDate}) as string,
            text: date.format('MMM DD')
        }
    },  [dueDate]);

  return (
    <ConfigProvider
        theme={{
            components:{
                Tag:{ 
                    colorText: token.colorTextSecondary
                },
                Card:{
                    headerBg: 'transparent'
                }
            }
        }}
    >
        <Card 
            size='small'
            title={<Text ellipsis={{tooltip: title}}>{title}</Text>}
            onClick={() => edit()}
            extra={
                <Dropdown
                    trigger={['click']}
                    menu={{
                        items: dropdownItems
                    }}
                >

                </Dropdown>
            }
        >
            <TextIcon style={{marginRIght: '4px'}}/>
            {dueDateOptions && (
                <Tag
                    icon ={
                        <ClockCircleOutlined style={{fontSize:'12px'}} />
                    }
                >

                </Tag>
            )}
        </Card>
    </ConfigProvider>
  )
}

export default ProjectCard