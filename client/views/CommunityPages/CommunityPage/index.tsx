import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { apiRemoveCommunity } from '../../../api'
import { MaxWidthContainer } from '../../../components'
import Button from '../../../components/Button'
import { AddMemberModal, PostList } from '../../../features'
import ModeratorsModal from '../../../features/ModeratorsModal'
import { GlobalContext } from '../../../state/globalState'
import { CommunityAdminRole, DetailedCommunity } from '../../../types'
import {
  ButtonWrapper,
  MemberButtonsWrapper,
  Title
} from './CommunitiesPage.styled'

type CommunityProps = {
  communityAdminRole: CommunityAdminRole
  community: DetailedCommunity
}

export default function CommunityPage({
  community,
  communityAdminRole
}: CommunityProps) {
  const router = useRouter()
  const { state } = useContext(GlobalContext)
  const [showAddMembers, setShowAddMembers] = useState(false)
  const [showModerators, setShowModerators] = useState(false)

  function removeCommunity() {
    async function deleteCommunity() {
      await apiRemoveCommunity({
        slug: router.query.slug as string
      })
      router.reload()
    }
    deleteCommunity()
  }

  return (
    <MaxWidthContainer>
      <AddMemberModal
        showModal={showAddMembers}
        setShowModal={setShowAddMembers}
        community={community}
      />
      <ModeratorsModal
        showModal={showModerators}
        setShowModal={setShowModerators}
      />
      <Title>
        Community <span>{`'${community.title}'`}</span>
      </Title>
      <ButtonWrapper>
        <MemberButtonsWrapper>
          <Button onClick={() => router.push(`/${router.query.slug}/new-post`)}>
            Add new post
          </Button>
          <Button onClick={() => setShowModerators(true)}>
            See moderators
          </Button>
          <Button onClick={() => router.push(`${router.query.slug}/members`)}>
            See members
          </Button>
          {communityAdminRole && (
            <Button onClick={() => setShowAddMembers(true)}>Add member</Button>
          )}
          {communityAdminRole == 'admin' && (
            <Button onClick={() => router.push(`${router.query.slug}/edit`)}>
              Edit info
            </Button>
          )}
        </MemberButtonsWrapper>
        {(communityAdminRole === 'admin' || state.user?.isAdmin) && (
          <Button danger onClick={removeCommunity}>
            Delete community
          </Button>
        )}
      </ButtonWrapper>
      <PostList isCommunityAdmin={!!communityAdminRole} />
    </MaxWidthContainer>
  )
}
